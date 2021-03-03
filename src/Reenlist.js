

export function Reenlist({ game, career, display, onSuccess, onFailure, onRetirement }) {
    if (display && game === 'classic') {
        return (
            <ReenlistCT
                career={career}
                onSuccess={onSuccess}
                onFailure={onFailure}
                onRetirement={onRetirement}
            />
        );
    } else {
        return (<div></div>);
    }
}